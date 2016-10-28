//
//  AWContext.m
//  aniwei
//
//  Created by weiyanhai on 16/10/5.
//  Copyright © 2016年 wiki.aniwei. All rights reserved.
//

#import "AWContext.h"

static AWContext *context = nil;

@implementation AWContext

- (instancetype) init {
    self = [super init];
    
    if (self) {
        _context = [[NSMutableDictionary alloc] init];
    }
    
    return self;
}

- (instancetype) envForContext: (NSString *)pathForEngine {
    NSString *documentPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    NSString *cachePath = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    
    [_context setObject:NSHomeDirectory() forKey:@"HOME"];
    [_context setObject:[[NSBundle mainBundle] bundlePath]  forKey:@"APP"];
    [_context setObject:cachePath forKey:@"CACHE"];
    [_context setObject:documentPath forKey:@"DOCUMENT"];
    [_context setObject:NSTemporaryDirectory() forKey:@"TMP"];
    [_context setObject:pathForEngine forKey:@"ENGINE"];
    
    return self;
}

- (instancetype) aboutMeForContext: (AWConfigure *)configure  {
    [_context setObject:configure.version forKey:@"version"];
    [_context setObject:configure.author forKey:@"author"];
    [_context setObject:@"iOS" forKey:@"platform"];
    
    return self;
}

- (instancetype) sourceForScriptModule:(AWConfigure *) configure {
    NSMutableArray *modules = [configure modules];
    NSMutableDictionary *source = [[NSMutableDictionary alloc] init];
    
    for (int i = 0; i < [modules count]; i++ ) {
        NSMutableDictionary *fileObject = [modules objectAtIndex:i];
        NSString *filePath = [fileObject objectForKey:@"file"];
        NSString *moduleName = [fileObject objectForKey:@"name"];
        NSString *fileString = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
        [source setObject:fileString forKey:moduleName];
    }
    
    [_context setObject:source forKey:@"modules"];
    
    return self;
}

+ (instancetype) sharedContext: (NSString *)pathForEngine configureForEngine: (AWConfigure *)configure {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        context = [[AWContext alloc] init];
        
        [context envForContext: pathForEngine];
        [context aboutMeForContext:configure];
    });
    
    return context;
}

@end
