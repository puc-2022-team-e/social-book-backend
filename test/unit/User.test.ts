
import User from "../../src/domain/entity/User";

test("Deve criar uma instância do usuário", function()
{
    const user = new User(1,1,"John Lennon","blackbirdflies.com.uk","","singer and guitar player", new Date(), undefined, undefined);  
    expect(user).toBeInstanceOf(User);
});

