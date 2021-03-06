const express = require('express');
const router = express.Router();
const spotController = require('../controllers/spotController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(spotController.getSpots));
router.get('/spots', catchErrors(spotController.getSpots));
router.get('/spots/page/:page', catchErrors(spotController.getSpots));
router.get('/add',
  authController.isLoggedIn,
  spotController.addSpot);

router.post('/add',
  spotController.upload,
  catchErrors(spotController.resize),
  catchErrors(spotController.createSpot)
);

router.post('/add/:id',
  spotController.upload,
  catchErrors(spotController.resize),
  catchErrors(spotController.updateSpot)
);

router.get('/spots/:id/edit', catchErrors(spotController.editSpot));
router.get('/spot/:slug', catchErrors(spotController.getSpotBySlug));

router.get('/tags', catchErrors(spotController.getSpotsByTag));
router.get('/tags/:tag', catchErrors(spotController.getSpotsByTag));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);

// 1. Validate the registration data
// 2. register the user
// 3. we need to log them in
router.post('/register',
  userController.validateRegister,
  // we need to know about errors if
  // validation will be passed, but registration
  // will be failed in some reasons, e.g. second
  // registration with same email
  userController.register,
  authController.login
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn,
  userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

router.get('/map', spotController.mapPage);
router.get('/hearts', authController.isLoggedIn,
  catchErrors(spotController.getHearts));
router.post('/reviews/:id', authController.isLoggedIn,
  catchErrors(reviewController.addReview));

router.get('/top', catchErrors(spotController.getTopSpots));

// API Endpoints
router.get('/api/search', catchErrors(spotController.searchSpots));
router.get('/api/spots/near', catchErrors(spotController.mapSpots));
router.post('/api/spots/:id/heart', catchErrors(spotController.heartSpot));

module.exports = router;
