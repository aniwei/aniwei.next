//
//  AWEvents.m
//  aniwei
//
//  Created by weiyanhai on 16/10/5.
//  Copyright © 2016年 wiki.aniwei. All rights reserved.
//

#import "AWEvents.h"

static AWEvents *events = nil;

@implementation AWEvents

- (instancetype)init {
    self = [super init];
    
    if (self) {}
    
    return self;
}

- (instancetype)startApplicationEvents {
    id notify = [NSNotificationCenter defaultCenter];
    id delegate = _delegate;
    
    [notify addObserver:delegate selector:@selector(onAppWillTerminate:)
                   name:UIApplicationWillTerminateNotification object:nil];
    
    [notify addObserver:delegate selector:@selector(onAppDidFinishLaunching:)
                   name:UIApplicationDidFinishLaunchingNotification object:nil];
    
    [notify addObserver:delegate selector:@selector(onAppWillResignActive:)
                   name:UIApplicationWillResignActiveNotification object:nil];
    
    [notify addObserver:delegate selector:@selector(onAppDidBecomeActive:)
                   name:UIApplicationDidBecomeActiveNotification object:nil];
    
    [notify addObserver:delegate selector:@selector(onAppWillEnterForeground:)
                   name:UIApplicationWillEnterForegroundNotification object:nil];
    
    [notify addObserver:delegate selector:@selector(onAppDidEnterBackground:)
                   name:UIApplicationDidEnterBackgroundNotification object:nil];
    
    return self;
}

+ (instancetype)shareEvents {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        events = [[AWEvents alloc] init];
    });
    
    return events;
}

@end
