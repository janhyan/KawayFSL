import { userPool } from "./UserPool"

export default async function getCurrentUser() {
    return new Promise((resolve, reject) => {
        const cognitoUser = userPool.getCurrentUser()

        if (!cognitoUser) {
            reject(new Error("No current user found"))
            return
        }

        cognitoUser.getSession((err, session) => {
            if (err) {
                reject(err)
                return
            }

            cognitoUser.getUserAttributes((err, attributes) => {
                if (err) {
                    reject(err)
                    return
                }

                const userData = attributes.reduce((acc, attribute) => {
                    acc[attribute.Name] = attribute.Value
                    console.log(attribute.Name, attribute.Value)
                    return acc
                }
                , {})

                resolve({ ...userData, username:cognitoUser.username})
            })
        })
    }

    )
}