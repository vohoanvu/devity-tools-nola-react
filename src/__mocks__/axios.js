const axios = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    defaults: {
        headers: {
            common: {
                "Authorization": "",
            },
        },
    },
    create: () => axios
};

export default axios;