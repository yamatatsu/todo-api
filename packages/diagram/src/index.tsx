import React from "react";
import { PNG, Diagram, GeneralIcon } from "rediagram";
import {
  AWS,
  InvizAWS,
  Lambda,
  VPC,
  RDS,
  APIGateway,
  SecretsManager,
  Cognito,
} from "@rediagram/aws";

PNG(
  <Diagram title="TODO API">
    <InvizAWS>
      <AWS>
        <VPC>
          <VPC type="Private subnet">
            <RDS name="Aurora\nServerless" type="Aurora" />
          </VPC>
        </VPC>
        <Lambda
          name="Lambda"
          upstream={["Aurora\nServerless", "Secrets for RDS"]}
        />
        <SecretsManager name="Secrets for RDS" />
        <APIGateway name="REST API" upstream={["Lambda"]} />
        <Cognito name="UserPool" />
      </AWS>
      <GeneralIcon
        name="Client"
        type="Client"
        upstream={["REST API", "UserPool"]}
      />
    </InvizAWS>
  </Diagram>,
  { dir: "images" }
);
