const Comment = {
    author(parent, args, { db }, info) {
        return db.users.find(user => user.id === parent.author)
    },
    post(parent, arges, { db }, ifno) {
        return db.posts.find(post => post.id === parent.post)
    }
}

export { Comment as default }