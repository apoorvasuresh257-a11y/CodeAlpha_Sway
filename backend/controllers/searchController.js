// ============================================
// SWAY - Search Controller
// ============================================

const User = require("../models/User");


// ============================================
// SEARCH USERS
// ============================================

const searchUsers = async (req, res) => {

    try {

        // ----------------------------------------
        // GET SEARCH QUERY
        // ----------------------------------------

        const query =
            typeof req.query.q === "string"
                ? req.query.q.trim()
                : "";


        // ----------------------------------------
        // VALIDATE QUERY
        // ----------------------------------------

        if (!query) {

            return res.status(200).json({

                success: true,

                count: 0,

                users: []

            });

        }


        // ----------------------------------------
        // SEARCH USERS
        // ----------------------------------------

        const users =
            await User.find({

                $or: [

                    {
                        name: {
                            $regex: query,
                            $options: "i"
                        }
                    },

                    {
                        username: {
                            $regex: query,
                            $options: "i"
                        }
                    }

                ]

            })
                .select(
                    "name username avatar bio"
                )
                .limit(20);


        // ----------------------------------------
        // RESPONSE
        // ----------------------------------------

        return res.status(200).json({

            success: true,

            count: users.length,

            users

        });


    } catch (error) {

        console.error(
            "❌ Search users error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while searching users"

        });

    }

};


// ============================================
// EXPORT
// ============================================

module.exports = {

    searchUsers

};