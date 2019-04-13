const users = [
    {
        id: '1',
        name: 'ahmed',
        email: 'ahmed@ahmed.com',
        age: 26
    },
    {
        id: '2',
        name: 'omar',
        email: 'omar@omar.com'
    }
]

const posts = [
    {
        id: '1',
        title: 'post one',
        body: 'this is post one', 
        published: true,
        author: '2'
    },
    {
        id: '2',
        title: 'post two',
        body: 'this is post two',
        published: false,
        author: '1'
    },
    {
        id: '3',
        title: 'post three',
        body: 'this is post three',
        published: false,
        author: '1'
    }
]

const comments = [
    {
        id: '1',
        text: 'this is comment one',
        author: '1',
        post: '3'
    },
    {
        id: '2',
        text: 'this is comment two',
        author: '2',
        post: '3'
    },
    {
        id: '3',
        text: 'this is comment three',
        author: '1',
        post: '1'
    },
    {
        id: '4',
        text: 'this is comment four',
        author: '2',
        post: '2'
    }
]


const db = {
    users,
    posts,
    comments
}

export { db as default }