/**
 * Created by lk on 18/4/28.
 */

const index = {
    code: 200,
    data: {
        id: 1,
        token:
            "eyJpZHNzIjoiJDJ5JDEwJGNmMVpVb3BxM2lEUUk0bllVZXkxenUzajM0QVJlYmEuS3B4aDZ1MkNkY1J4clF6SE10MTRLIn0=_2018-04-27"
    }
};

const userInfo = {
    code: 200,
    data: {
        status: "1",
        id: 1,
        username: "admin",
        avatar: "",
        authRules: ["admin"],
        token:
            "eyJpZHNzIjoiJDJ5JDEwJGNmMVpVb3BxM2lEUUk0bllVZXkxenUzajM0QVJlYmEuS3B4aDZ1MkNkY1J4clF6SE10MTRLIn0=_2018-04-27"
    }
};

const out = { code: 200, message: "success" };

const password = { code: 200, message: "success" };

export default {
    index,
    userInfo,
    out,
    password
};
