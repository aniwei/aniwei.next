//
//  AWScriptEngine.m
//  aniwei
//
//  Created by weiyanhai on 16/10/5.
//  Copyright © 2016年 wiki.aniwei. All rights reserved.
//

#import "AWScriptEngine.h"

static AWScriptEngine *jsEngine = nil;

@implementation AWScriptEngine

- (instancetype)init {
    self = [super init];
    
    if (self) {
        [self readyForScriptEngine];
    }
    
    return self;
}

- (instancetype)readyForScriptEngine {
    _jsContext = [[JSContext alloc] init];
    
    return self;
}

- (instancetype)startScriptEngine {
    
    return self;
}

- (instancetype)eval:(NSString *)scriptText {
    if (scriptText == nil) {
        return self;
    }
    
    [_jsContext evaluateScript:scriptText];
    
    return self;
}

+ (instancetype)sharedScriptEngine {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        jsEngine = [[AWScriptEngine alloc] init];
    });
    
    return jsEngine;
}

@end
