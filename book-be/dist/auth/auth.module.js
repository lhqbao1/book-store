'use strict';var _0x2fa75e=_0x452a;(function(_0x6fe71d,_0x5ae371){var _0x2d683d=_0x452a,_0xa23319=_0x6fe71d();while(!![]){try{var _0x1327a9=-parseInt(_0x2d683d(0x202))/0x1+parseInt(_0x2d683d(0x1f8))/0x2+-parseInt(_0x2d683d(0x1e9))/0x3+parseInt(_0x2d683d(0x1ef))/0x4*(-parseInt(_0x2d683d(0x200))/0x5)+-parseInt(_0x2d683d(0x1f9))/0x6+parseInt(_0x2d683d(0x1f3))/0x7+parseInt(_0x2d683d(0x1fa))/0x8;if(_0x1327a9===_0x5ae371)break;else _0xa23319['push'](_0xa23319['shift']());}catch(_0x392474){_0xa23319['push'](_0xa23319['shift']());}}}(_0x2c85,0x2b7f9));var __decorate=this&&this[_0x2fa75e(0x1f5)]||function(_0x11faa7,_0x9528c6,_0x5610b2,_0x100184){var _0x371948=_0x2fa75e,_0x51a55b,_0x1f83fb=arguments[_0x371948(0x1eb)],_0x2f5c07=_0x1f83fb<0x3?_0x9528c6:null===_0x100184?_0x100184=Object['getOwnPropertyDescriptor'](_0x9528c6,_0x5610b2):_0x100184;if(_0x371948(0x204)==typeof Reflect&&'function'==typeof Reflect['decorate'])_0x2f5c07=Reflect[_0x371948(0x1f1)](_0x11faa7,_0x9528c6,_0x5610b2,_0x100184);else{for(var _0x35de01=_0x11faa7[_0x371948(0x1eb)]-0x1;0x0<=_0x35de01;_0x35de01--)(_0x51a55b=_0x11faa7[_0x35de01])&&(_0x2f5c07=(_0x1f83fb<0x3?_0x51a55b(_0x2f5c07):0x3<_0x1f83fb?_0x51a55b(_0x9528c6,_0x5610b2,_0x2f5c07):_0x51a55b(_0x9528c6,_0x5610b2))||_0x2f5c07);}return 0x3<_0x1f83fb&&_0x2f5c07&&Object['defineProperty'](_0x9528c6,_0x5610b2,_0x2f5c07),_0x2f5c07;};Object[_0x2fa75e(0x1f7)](exports,_0x2fa75e(0x1fc),{'value':!0x0}),exports[_0x2fa75e(0x1e8)]=void 0x0;const common_1=require(_0x2fa75e(0x1e5)),auth_service_1=require(_0x2fa75e(0x1e7)),auth_controller_1=require(_0x2fa75e(0x1fb)),user_module_1=require(_0x2fa75e(0x1ed)),passport_1=require(_0x2fa75e(0x1ea)),local_strategy_1=require(_0x2fa75e(0x1fe)),jwt_1=require(_0x2fa75e(0x1ee)),jwt_strategy_1=require('./jwt.strategy');require('dotenv')[_0x2fa75e(0x1e4)]();function _0x2c85(){var _0x51bdb0=['__decorate','PassportModule','defineProperty','386716OvqWBM','1705530pQXNEZ','4372808ByhDQB','./auth.controller','__esModule','JwtModule','./local.strategy','LocalStrategy','265480foNeEN','JWT_ACCESS_SECRET','279927RYcCev','JWT_ACCESS_EXPIRE_IN','object','env','config','@nestjs/common','AuthController','./auth.service','AuthModule','96900IOJHbU','@nestjs/passport','length','Module','../user/user.module','@nestjs/jwt','8Jxehny','AuthService','decorate','register','986188XQKSDQ','JwtStrategy'];_0x2c85=function(){return _0x51bdb0;};return _0x2c85();}function _0x452a(_0x2d20e0,_0x1ac01e){var _0x2c85c5=_0x2c85();return _0x452a=function(_0x452ae0,_0xf20d2f){_0x452ae0=_0x452ae0-0x1e3;var _0xd9760c=_0x2c85c5[_0x452ae0];return _0xd9760c;},_0x452a(_0x2d20e0,_0x1ac01e);}let AuthModule=class{};AuthModule=__decorate([(0x0,common_1[_0x2fa75e(0x1ec)])({'controllers':[auth_controller_1[_0x2fa75e(0x1e6)]],'providers':[auth_service_1[_0x2fa75e(0x1f0)],local_strategy_1[_0x2fa75e(0x1ff)],jwt_strategy_1[_0x2fa75e(0x1f4)]],'imports':[user_module_1['UserModule'],passport_1[_0x2fa75e(0x1f6)],jwt_1[_0x2fa75e(0x1fd)][_0x2fa75e(0x1f2)]({'secret':process[_0x2fa75e(0x1e3)][_0x2fa75e(0x201)],'signOptions':{'expiresIn':process[_0x2fa75e(0x1e3)][_0x2fa75e(0x203)]}})],'exports':[auth_service_1['AuthService']]})],AuthModule),exports['AuthModule']=AuthModule;