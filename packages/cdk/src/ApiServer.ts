import {
  App,
  Stack,
  StackProps,
  aws_ec2,
  aws_lambda,
  aws_lambda_nodejs,
  aws_apigateway,
  aws_secretsmanager,
  Duration,
  aws_cognito,
} from "aws-cdk-lib";

type Props = StackProps & {
  codeEntry: string;
  vpc: aws_ec2.IVpc;
  securityGroup: aws_ec2.ISecurityGroup;
  dbCredentialSecret: aws_secretsmanager.ISecret;
  proxyEndpoint: string;
  userPool: aws_cognito.IUserPool;
};

export class ApiServerStack extends Stack {
  constructor(parent: App, id: string, props: Props) {
    super(parent, id, props);

    // TODO: lambda insight入れる
    const handler = new aws_lambda_nodejs.NodejsFunction(this, "Lambda", {
      entry: props.codeEntry,
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      // TODO: aurora serverless やめて rds proxyつけたら10秒に戻す
      timeout: Duration.seconds(20),
      vpc: props.vpc,
      securityGroups: [props.securityGroup],
      bundling: {
        /**
         * esbuildの成果物にprismaのengineが含める必要がある
         * Respect for https://dev.to/prisma/bundling-prisma-with-the-cdk-using-aws-lambda-nodejs-2lkd
         */
        nodeModules: ["@prisma/client", "prisma"],
        commandHooks: {
          beforeBundling(inputDir: string, outputDir: string): string[] {
            return [];
          },
          beforeInstall(inputDir: string, outputDir: string) {
            return [`cp -R ../prisma ${outputDir}/`];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [
              `cd ${outputDir}`,
              `yarn prisma generate`,
              `rm -rf node_modules/@prisma/engines`,
            ];
          },
        },
        /**
         * forceDockerBundling: これは default false であるが、下記理由により明示的に示す。
         * これが true のとき、もしくは esbuild が見つからないとき(下記URL参照)に、
         * NodejsFunction では docker を用いてビルドが行われる。
         * https://github.com/aws/aws-cdk/blob/4c8e938e01b87636390a4f04de63bcd4dfe44cf8/packages/@aws-cdk/aws-lambda-nodejs/lib/esbuild-installation.ts#L8-L31
         * dockerでビルドする場合、特に Mac M1 での実行結果と GitHub actions 上での実行結果とで、
         * 成果物のfingerprintがズレて snapshot test が落ちてしまう。
         * そのため、 forceDockerBundling を明示し、 package.json でも esbuild を明示的にインストールする。
         */
        forceDockerBundling: false,
      },
      environment: {
        NODE_ENV: "production",
        SECRET_NAME: props.dbCredentialSecret.secretName,
        DATABASE_ENDPOINT: props.proxyEndpoint,
      },
    });

    props.dbCredentialSecret.grantRead(handler);

    // const authorizer = new aws_apigateway.CognitoUserPoolsAuthorizer(
    //   this,
    //   "Authorizer",
    //   {
    //     cognitoUserPools: [],
    //     identitySource: "method.request.header.x-ta-token",
    //   }
    // );

    const restApi = new aws_apigateway.LambdaRestApi(this, "LambdaRestApi", {
      handler,
      deployOptions: {
        metricsEnabled: true,
        loggingLevel: aws_apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        tracingEnabled: true,
      },
      // defaultMethodOptions: {
      //   authorizer,
      // },
    });
  }
}
