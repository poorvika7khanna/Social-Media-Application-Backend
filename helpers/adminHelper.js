const isAdmin = (req) => {
    if(req.user.role === "ADMIN") {
        return true;
    }
    return false;
}

module.exports = { isAdmin }