//
//  LangParser.m
//  MapsApp
//
//  Created by Ishan Sengupta on 9/9/20.
//

#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_MODULE(LangParser, NSObject)

RCT_EXTERN_METHOD(increment)
RCT_EXTERN_METHOD(getCount: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(callbackMethod:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(simpleMethod:(NSString *)message)
RCT_EXTERN_METHOD(
login: (NSString *)email
password:(NSString *)password
resolve: (RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
getSentiment: (NSString *)text
resolve: (RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject
)
@end
