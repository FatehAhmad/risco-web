import { InterestsModel } from "./interests";

export class BasketSettings{
    DeliveryFee: number;
    Currency: number;
    AboutUs: string;
    FreeDeliveryThreshold: number;
    PrivacyPolicy: string;
    TermsConditions: string;
    FAQs: string;
    AdminEmailForOrders: string;
    Interests:InterestsModel[];
}