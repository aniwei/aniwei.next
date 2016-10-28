//
//  AWScriptEngine.h
//  aniwei
//
//  Created by weiyanhai on 16/10/5.
//  Copyright © 2016年 wiki.aniwei. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

@interface AWScriptEngine : NSObject

@property (atomic, strong) JSContext *jsContext;

+ (instancetype)sharedScriptEngine;

- (instancetype)startScriptEngine;

@end
