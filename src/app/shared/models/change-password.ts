export class ChangePasswordModel{
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
    SignInType: number=0;
}

export class ResetPasswordModel{
    NewPassword: string;
    ConfirmPassword: string;
    User_Id: number=0;
}