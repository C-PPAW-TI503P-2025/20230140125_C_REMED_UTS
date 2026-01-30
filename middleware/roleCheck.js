// Middleware untuk mengecek role admin
const checkAdmin = (req, res, next) => {
    const userRole = req.headers['x-user-role'];

    if (!userRole) {
        return res.status(401).json({
            success: false,
            message: 'Header x-user-role diperlukan'
        });
    }

    if (userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Akses ditolak. Hanya admin yang dapat mengakses endpoint ini'
        });
    }

    next();
};

// Middleware untuk mengecek role user
const checkUser = (req, res, next) => {
    const userRole = req.headers['x-user-role'];
    const userId = req.headers['x-user-id'];

    if (!userRole) {
        return res.status(401).json({
            success: false,
            message: 'Header x-user-role diperlukan'
        });
    }

    if (userRole !== 'user') {
        return res.status(403).json({
            success: false,
            message: 'Akses ditolak. Hanya user yang dapat mengakses endpoint ini'
        });
    }

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Header x-user-id diperlukan'
        });
    }

    // Attach userId to request object for use in controller
    req.userId = parseInt(userId);
    next();
};

module.exports = { checkAdmin, checkUser };
