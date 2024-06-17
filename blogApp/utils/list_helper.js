const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((favorite, currentBlog) => {
        return currentBlog.likes > (favorite?.likes || -Infinity) ? currentBlog : favorite
    }, null)
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}