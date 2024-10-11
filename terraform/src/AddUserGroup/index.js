const { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { InvokeCommand, LambdaClient, LogType } = require("@aws-sdk/client-lambda");

exports.handler = async (event, context, callback) => {
  const { userName, userPoolId } = event;

  try {
    await invoke('RDSAddUser', event);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }

  try {
    // Assign the user to a specific group
    await addUserToGroup({
      userPoolId,
      username: userName,
      groupName: 'VerifiedUsers',
    });

    // Return success
    return callback(null, event);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }
};

const invoke = async (funcName, payload) => {
    const client = new LambdaClient({});
    const command = new InvokeCommand({
      FunctionName: funcName,
      Payload: JSON.stringify(payload),
      LogType: LogType.Tail,
    });
  
    const { Payload, LogResult } = await client.send(command);
    const result = Buffer.from(Payload).toString();
    const logs = Buffer.from(LogResult, "base64").toString();
    return { logs, result };
  };

async function addUserToGroup({ userPoolId, username, groupName }) {
  const params = {
    GroupName: groupName,
    UserPoolId: userPoolId,
    Username: username,
  };

  const cognitoIdp = new CognitoIdentityProviderClient();
  await cognitoIdp.send(new AdminAddUserToGroupCommand(params));
}
