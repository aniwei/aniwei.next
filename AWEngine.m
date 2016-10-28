//
//  AWEngine.m
//  aniwei
//
//  Created by weiyanhai on 16/10/5.
//  Copyright © 2016年 wiki.aniwei. All rights reserved.
//

#import "AWEngine.h"

static AWEngine *engine = nil;

@implementation AWEngine

- (instancetype)init {
    self = [super init];
    
    if (self) {
        [self readyForEngine];
    }
    
    return self;
}

- (instancetype)readyForEngine {
    NSBundle *mainBundle = [NSBundle mainBundle];
    
    _engineDirectory = [[mainBundle bundlePath] stringByAppendingString:@"/AWEngine"];
    _engineConfigureDirectory = [mainBundle pathForResource:@"package" ofType:@"json"];
    _engineScriptDirectory = _engineDirectory;
    
    _engineConfigure = [AWConfigure sharedConfigure: _engineConfigureDirectory
                                      pathForScript:_engineScriptDirectory
                                      pathForEngine:_engineDirectory];
    
    _engineEvents = [AWEvents shareEvents];
    _engineEvents.delegate = self;
    [_engineEvents startApplicationEvents];
    
    _engineContext = [AWContext sharedContext: _engineDirectory
                           configureForEngine: _engineConfigure];
    
    _engineThread = [[NSThread alloc] initWithTarget:self
                                            selector:@selector(runloop)
                                              object:nil];
    
    _engeinScript = [AWScriptEngine sharedScriptEngine];
    
    return self;
}

- (instancetype)startEngine {
    [_engeinScript startScriptEngine];
    [_engineThread start];
    
    return self;
}

- (instancetype)runloop {
    NSRunLoop *currentRunloop = [NSRunLoop currentRunLoop];
    [currentRunloop addPort:[NSPort port] forMode:NSDefaultRunLoopMode];
    [currentRunloop run];
    return self;
}

+ (id)sharedEngine {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        engine = [[AWEngine alloc] init];
    });
    
    return engine;
}

- (void)onAppDidFinishLaunching:(NSNotification*)notification {}

- (void)onAppWillTerminate:(NSNotification*)notification {}

- (void)onAppWillResignActive:(NSNotification*)notification {}

- (void)onAppWillEnterForeground:(NSNotification*)notification {}

- (void)onAppDidBecomeActive:(NSNotification*)notification {}

- (void)onAppDidEnterBackground:(NSNotification*)notification {}

@end
