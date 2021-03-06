export class InterestsModel{
    Id: number;
    Name: string;
    IsDeleted: boolean;
    Checked: boolean;
    ImageUrl: string;

    ChildInterests: InterestsModel[];
    Selected: boolean = false;
}
