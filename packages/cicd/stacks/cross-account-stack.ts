import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'

import * as iam from 'aws-cdk-lib/aws-iam'

interface CrossAccountStackProps extends StackProps {
  stage: string
}

export class CrossAccountStack extends Stack {

  readonly crossAccountDeployRole: iam.IRole

  constructor(scope: Construct, id: string, props: CrossAccountStackProps) {
    super(scope, id, props)
    const trustPrincipals: iam.PrincipalBase[] = []
    const stage = props.stage
    if (stage.startsWith('dev') || stage.endsWith('dev')) {
      // Allow users in devs account to assume the deployment role to deploy manually
      // with fast `sls deploy`, for example. Should not be enabled for other targets where
      // deployment should always be automated.
      trustPrincipals.push(new iam.AccountPrincipal(this.account))
    }

    const deployAccount = this.node.tryGetContext('deploy-account') || this.account
    if (deployAccount) {
      trustPrincipals.push(new iam.AccountPrincipal(deployAccount))
    }

    this.crossAccountDeployRole = new iam.Role(this, `${stage}CrossAccountDeployRole`, {
      roleName: `${stage}CrossAccountDeployRole`,
      assumedBy: new iam.CompositePrincipal(...trustPrincipals)
    })
    const services = [
      'cloudformation',
      'cloudwatch',
      'apigateway',
      'lambda',
      'cloudfront',
      'iam',
      's3',
      'logs',
      'dynamodb',
      'events',
      'acm',
      'route53',
      'cognito-idp',
      'cognito-identity',
      'ses',
      'sqs',
      'ssm',
    ]
    for (const service of services) {
      this.crossAccountDeployRole.addToPrincipalPolicy(new iam.PolicyStatement({
        actions: [`${service}:*`],
        resources: ['*']
      }))
    }
  }

}
