//
//  AWEngine.h
//  aniwei
//
//  Created by weiyanhai on 16/10/5.
//  Copyright © 2016年 wiki.aniwei. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "AWEvents.h"
#import "AWScriptEngine.h"
#import "AWConfigure.h"
#import "AWContext.h"

@interface AWEngine : NSObject <AWEventsProtocol>

@property (atomic, strong) AWContext *engineContext;

@property (atomic, strong) AWEvents *engineEvents;

@property (atomic, strong) NSThread *engineThread;

@property (atomic, strong) AWScriptEngine *engeinScript;

@property (atomic, strong) AWConfigure *engineConfigure;

@property (atomic, strong) NSString *engineDirectory;

@property (atomic, strong) NSString *engineScriptDirectory;

@property (atomic, strong) NSString *engineConfigureDirectory;

- (instancetype)init;

- (instancetype)startEngine;

+ (id)sharedEngine;

@end
