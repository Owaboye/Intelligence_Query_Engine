const profileService = require('../services/profileService');


exports.createProfile = async (req, res) =>{
    const { name } = req.body;
    try {
        if (name === undefined) {
          return res.status(400).json({
            status: "error",
            message: "Name is required"
          });
        }

        if (typeof name !== "string") {
          return res.status(422).json({
            status: "error",
            message: "Name must be a string"
          });
        }

        if (name.trim() === "") {
          return res.status(400).json({
            status: "error",
            message: "Name cannot be empty"
          });
        }

        const result = await profileService.createProfile(name);

        // return res.status(result.statusCode).json({
        //     status: "success",
        //     data: result.data,
        //     message: result.message
        // });

        const response = {
          status: "success",
          data: result.data
        };

        if (result.message) {
          response.message = result.message;
        }

        return res.status(result.statusCode).json(response);

    } catch (error) {
        
        if (error.type === "EXTERNAL") {
          return res.status(502).json({
            status: "error",
            message: error.message
          });
        }

        return res.status(500).json({
          status: "error",
          message: "Internal server error"
        });
    }

 }

//  Get All
exports.getAllProfiles = async (req, res) => {
  try {

    // EXTRACT QUERY PARAMS
    const rawPage = req.query.page;
    const rawLimit = req.query.limit;

    let page = 1;
    let limit = 10;

    if (rawPage !== undefined) {
      if (isNaN(Number(rawPage))) {
        return res.status(422).json({
          status: "error",
          message: "page must be a number"
        });
      }
      page = Math.max(Number(rawPage), 1);
    }

    if (rawLimit !== undefined) {
      if (isNaN(Number(rawLimit))) {
        return res.status(422).json({
          status: "error",
          message: "limit must be a number"
        });
      }
      limit = Math.min(Math.max(Number(rawLimit), 1), 50);
    }

    const filters = {
      ...req.query,
      page,
      limit
    };

    // if (filters.min_age && isNaN(Number(filters.min_age))) {

    if (filters.min_age !== undefined && isNaN(Number(filters.min_age))) {
      return res.status(422).json({
        status: "error",
        message: "min_age must be a number"
      });
    }

    if (filters.max_age !== undefined && isNaN(Number(filters.max_age))) {
      return res.status(422).json({
        status: "error",
        message: "max_age must be a number"
      });
    }

    if (filters.min_gender_probability !== undefined && isNaN(Number(filters.min_gender_probability))) {
      return res.status(422).json({
        status: "error",
        message: "minimun gender probability must be a number"
      });
    }

    if (filters.min_country_probability !== undefined && isNaN(Number(filters.min_country_probability))) {
      return res.status(422).json({
        status: "error",
        message: "min_country_probability must be a number"
      });
    }

  
   const result = await profileService.getAllProfiles(filters);
   
    // return res.status(200).json({
    //   status: "success",
    //   page: result.page,
    //   limit: result.limit,
    //   count: result.length,
    //   data: result
    // });

    //  const result = await repo.getAll(req.query);

    return res.status(200).json({
      status: "success",
      page: result.page,
      limit: result.limit,
      total: result.total,
      data: result.data
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

   const result = await profileService.getProfileById(id);

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found"
      });
    }

    return res.status(200).json({
      status: "success",
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

   const result = await profileService.deleteProfile(id);

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found"
      });
    }

    return res.status(204).send();

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// exports.searchProfiles = async (req, res) => {
//   try {
//     const { q } = req.query;

//     if (!q) {
//       return res.status(400).json({
//         status: "error",
//         message: "Query parameter q is required"
//       });
//     }

//     // reuse your pagination validation
//     const page = Math.max(Number(req.query.page) || 1, 1);
//     const limit = Math.min(Number(req.query.limit) || 10, 50);

//     const result = await profileService.searchProfiles({
//       q,
//       page,
//       limit
//     });

//     return res.status(200).json({
//       status: "success",
//       page: result.page,
//       limit: result.limit,
//       total: result.total,
//       data: result.data
//     });

//   } catch (error) {
//      if (error.message === "Unable to interpret query") {
//       return res.status(400).json({
//         status: "error",
//         message: error.message
//       });
//     }

//     return res.status(500).json({
//       status: "error",
//       message: "Internal server error"
//     });
//   }
// };

exports.searchProfiles = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        status: "error",
        message: "Query parameter q is required"
      });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const result = await profileService.searchProfiles({
      q,
      page,
      limit
    });

    return res.status(200).json({
      status: "success",
      page: result.page,
      limit: result.limit,
      total: result.total,
      data: result.data
    });

  } catch (error) {

    console.error("SEARCH ERROR:", error); //  IMPORTANT FOR RAILWAY DEBUGGING

    if (error.message === "Unable to interpret query") {
      return res.status(400).json({
        status: "error",
        message: error.message
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};