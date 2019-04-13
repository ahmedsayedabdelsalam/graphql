import { GraphQLServer } from 'graphql-yoga'
import { v4 } from 'uuid/v4'

let users = [
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

let posts = [
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

let comments = [
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

// type defenitions (shcma)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
        me: User!
        post : Post!
    }

    type Mutation {
        createUser(data: createUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: createPostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: createCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
    }

    input createUserInput {
        name: String!,
        email: String!,
        age: Int
    }

    input createPostInput {
        title: String!,
        body: String!,
        published: Boolean!,
        author: ID!
    }

    input createCommentInput {
        text: String!,
        author: ID!,
        post: ID!
    }

    type User {
        id: ID!,
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) return users
            
            return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        posts(parent, args, ctx, info) {
            if (! args.query) return posts

            return posts.filter(post => {
                return post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()) || post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
            })
        },
        comments(parent, args, ctx, info) {
            if (! args.query) return comments

            return comments.filter(comment => comment.text.toLowerCase().includes(args.query.toLocaleLowerCase()))
        },
        me() {
            return {
                id: '123abc',
                name: 'ahmed sayed abdelsalam',
                email: 'ahmed.sayed@code95.info'
            }
        },
        post() {
            return {
                id: 'weet',
                title: 'post one',
                body: 'this is new post',
                published: true
            }
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(user => user.email === args.data.email)
            if (emailTaken) throw new Error('Email Taken.')
            
            const user = {
                id: v4(),
                ...args.data,
            }

            users.push(user)

            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex(user => user.id === args.id)
            if (userIndex === -1) throw new Error('user not found')

            const [deletedUser] = users.splice(userIndex, 1)

            posts = posts.filter(post => {
                const match = post.author === args.id
                if(!match) return true

                comments = comments.filter(comment => comment.post !== post.id)
                return false
            })

            comments = comments.filter(comment => comment.author !== args.id)

            return deletedUser
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author)
            if (! userExists) throw new Error('User not found')

            const post = {
                id: v4(),
                ...args.data
            }

            posts.push(post)

            return post
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex(post => post.id === args.id)
            if (postIndex === -1) throw new Error('post not found')

            const [deletedPost] = posts.splice(postIndex, 1)

            comments = comments.filter(comment => comment.post !== args.id)

            return deletedPost
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author)
            if (! userExists) throw new Error('User not Found')

            const postExistsAndPublished = posts.some(post => post.id === args.data.post && post.published)
            if (! postExistsAndPublished) throw new Error('Post is not available')

            const comment = {
                id: v4(),
                ...args.data
            }

            comments.push(comment)

            return comment
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex(comment => comment.id === args.id)
            if (commentIndex === -1) throw new Error('comment not found')

            const [comment] = comments.splice(commentIndex, 1)

            return comment
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.post === parent.id)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => post.author === parent.id)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.author === parent.id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        },
        post(parent, arges, ctx, ifno) {
            return posts.find(post => post.id === parent.post)
        }
    }
}


const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(_ => {
    console.log('server is up')
})
