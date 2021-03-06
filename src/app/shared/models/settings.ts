import { InterestsModel } from "./interests";

export class SettingsModel{
    DeliveryFee: number;
    Currency: number;
    AboutUs: string
    FreeDeliveryThreshold: number;
    PrivacyPolicy: string;
    TermsConditions: string;
    PostUrl: string;
    FAQs: string;
    AdminEmailForOrders: string;
    Interests: InterestsModel[];
}