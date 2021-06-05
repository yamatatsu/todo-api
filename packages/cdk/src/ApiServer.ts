import {
  App,
  Stack,
  StackProps,
  aws_ec2 as ec2,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
} from "aws-cdk-lib";

type Props = StackProps & {
  codeEntry: string;
  vpc: ec2.IVpc;
  dbCredentialSecretName: string;
  dbHost: string;
  dbPort: string;
};

export class ApiServerStack extends Stack {
  constructor(parent: App, id: string, props: Props) {
    super(parent, id, props);

    new lambda_nodejs.NodejsFunction(this, "Lambda", {
      entry: props.codeEntry,
      runtime: lambda.Runtime.NODEJS_14_X,
      vpc: props.vpc,
      bundling: {
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
        SECRET_NAME: props.dbCredentialSecretName,
        DB_HOST: props.dbHost,
        DB_PORT: props.dbPort,
      },
    });
  }
}
