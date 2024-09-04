import React from "react";
import {userPool} from "./UserPool";

export default function userSignUp(email, password, firstName, middleName, lastName) {
    return new Promise((resolve, reject) => {
      userPool.signUp(
        email,
        password,
        [
          {
            Name: "family_name",
            Value: lastName,
          },
          {
            Name: "given_name",
            Value: firstName,
          },
          {
            Name: "middle_name",
            Value: middleName,
          },
        ],
        null,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result.user);
        }
      );
    });
  }
  