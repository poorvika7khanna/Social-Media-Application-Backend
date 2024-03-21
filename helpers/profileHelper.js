const getProfileDetails = (user) => {
    const profileDetails = {
        username: user.username,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        image_url: user.image_url,
        profile_type: user.profileType,
    }
    return profileDetails;
}

module.exports = { getProfileDetails }