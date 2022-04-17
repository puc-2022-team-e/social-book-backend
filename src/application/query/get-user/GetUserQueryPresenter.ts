import GetUserOutput from "../../usecase/get-user/GetUserOutput";

// Output Boundary
export default interface GetUserQueryPresenter {
	present(getUserOutput: GetUserOutput): void;
}