'use strict';var _0x3cea84=_0x4dbf;(function(_0x287456,_0x120bfd){var _0x544491=_0x4dbf,_0x190781=_0x287456();while(!![]){try{var _0x245d5e=parseInt(_0x544491(0x205))/0x1+-parseInt(_0x544491(0x1f0))/0x2*(parseInt(_0x544491(0x203))/0x3)+parseInt(_0x544491(0x1f6))/0x4+-parseInt(_0x544491(0x20c))/0x5+parseInt(_0x544491(0x210))/0x6*(-parseInt(_0x544491(0x202))/0x7)+-parseInt(_0x544491(0x1f7))/0x8*(-parseInt(_0x544491(0x1fe))/0x9)+parseInt(_0x544491(0x1ef))/0xa*(parseInt(_0x544491(0x200))/0xb);if(_0x245d5e===_0x120bfd)break;else _0x190781['push'](_0x190781['shift']());}catch(_0x2c0570){_0x190781['push'](_0x190781['shift']());}}}(_0x3a5f,0xc7049));var __importDefault=this&&this[_0x3cea84(0x20a)]||function(_0x40582e){var _0x6484bf=_0x3cea84;return _0x40582e&&_0x40582e[_0x6484bf(0x20d)]?_0x40582e:{'default':_0x40582e};};Object[_0x3cea84(0x1f3)](exports,_0x3cea84(0x20d),{'value':!0x0});const core_1=require(_0x3cea84(0x207)),common_1=require(_0x3cea84(0x1f5)),app_module_1=require(_0x3cea84(0x20f)),transform_interceptor_1=require('./core/interceptors/transform.interceptor'),cookie_parser_1=__importDefault(require(_0x3cea84(0x1fa))),jwt_auth_guard_1=require(_0x3cea84(0x1fb));async function bootstrap(){var _0x403eec=_0x3cea84,_0x1ca52b=process[_0x403eec(0x1f1)][_0x403eec(0x1f9)]||0x1f40,_0x3ebbee=await core_1[_0x403eec(0x1f4)][_0x403eec(0x1f2)](app_module_1[_0x403eec(0x1f8)]),_0x3e369b=(_0x3ebbee['enableCors']({'origin':!0x0,'methods':_0x403eec(0x1ee),'preflightContinue':!0x1,'credentials':!0x0}),_0x3ebbee[_0x403eec(0x20e)]((0x0,cookie_parser_1[_0x403eec(0x209)])()),_0x3ebbee['useGlobalPipes'](new common_1['ValidationPipe']()),_0x3ebbee['useGlobalInterceptors'](new transform_interceptor_1[(_0x403eec(0x201))]()),_0x3ebbee['setGlobalPrefix']('/api/v1/',{'exclude':['/']}),_0x3ebbee[_0x403eec(0x206)](core_1[_0x403eec(0x1ff)]));_0x3ebbee[_0x403eec(0x208)](new jwt_auth_guard_1[(_0x403eec(0x20b))](_0x3e369b)),await _0x3ebbee[_0x403eec(0x1fd)](_0x1ca52b);}function _0x4dbf(_0x5a05df,_0x28eb21){var _0x3a5fe9=_0x3a5f();return _0x4dbf=function(_0x4dbf2a,_0x423abe){_0x4dbf2a=_0x4dbf2a-0x1ee;var _0x247985=_0x3a5fe9[_0x4dbf2a];return _0x247985;},_0x4dbf(_0x5a05df,_0x28eb21);}require(_0x3cea84(0x204))[_0x3cea84(0x1fc)](),bootstrap();function _0x3a5f(){var _0x41d1f4=['2051682zgzPyJ','GET,HEAD,PUT,PATCH,POST,DELETE','80rRPfaX','8SpzNWk','env','create','defineProperty','NestFactory','@nestjs/common','220032HxzTVW','8EWFQvI','AppModule','PORT','cookie-parser','./auth/jwt-auth.guard','config','listen','6775767HOCVes','Reflector','3131821YGZGrZ','TransformInterceptor','7fYHEKl','927759aNvOEs','dotenv','438958orSqOG','get','@nestjs/core','useGlobalGuards','default','__importDefault','JwtAuthGuard','5651905ibyHQk','__esModule','use','./app.module'];_0x3a5f=function(){return _0x41d1f4;};return _0x3a5f();}