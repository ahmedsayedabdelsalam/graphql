const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) return db.users
        
        return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    posts(parent, args, { db }, info) {
        if (! args.query) return db.posts

        return db.posts.filter(post => {
            return post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()) || post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
        })
    },
    comments(parent, args, { db }, info) {
        if (! args.query) return db.comments

        return db.comments.filter(comment => comment.text.toLowerCase().includes(args.query.toLocaleLowerCase()))
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
}

export { Query as default }