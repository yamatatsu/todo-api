import {
  App,
  Stack,
  StackProps,
  RemovalPolicy,
  aws_cognito,
} from "aws-cdk-lib";

export class CognitoStack extends Stack {
  public readonly userPool: aws_cognito.IUserPool;

  constructor(parent: App, id: string, props?: StackProps) {
    super(parent, id, props);

    const userPool = new aws_cognito.UserPool(this, "UserPool", {
      selfSignUpEnabled: true,
      signInAliases: { username: true, email: true },
      customAttributes: {
        validated_email: new aws_cognito.StringAttribute({
          mutable: true,
        }),
      },
      passwordPolicy: {
        // Because of https://pages.nist.gov/800-63-3/sp800-63b.html#-5112-memorized-secret-verifiers
        minLength: 8,
        // Because of https://pages.nist.gov/800-63-3/sp800-63b.html#a3-complexity
        requireLowercase: false,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new aws_cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      authFlows: { userSrp: true },
    });

    this.userPool = userPool;
  }
}
