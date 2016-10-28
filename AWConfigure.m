//
//  AWConfigure.m
//  aniwei
//
//  Created by weiyanhai on 16/10/5.
//  Copyright © 2016年 wiki.aniwei. All rights reserved.
//

#import "AWConfigure.h"

static AWConfigure *configure = nil;

@implementation AWConfigure

- (instancetype)init {
    self = [super init];
    
    if (self) {}
    
    return self;
}

- (instancetype)readyForConfigure:(NSString *)filePath pathForScript: (NSString *)scriptPath pathForEngein: (NSString *)enginePath{
    _configureFilePath = filePath;
    _scriptFilePath = scriptPath;
    _enginePath = enginePath;
    
    return self;
}


- (instancetype)fileForConfigure {
    NSData *fileData = [NSData dataWithContentsOfFile:_configureFilePath];
    NSMutableDictionary *fileJSON = [NSJSONSerialization JSONObjectWithData:fileData options:kNilOptions error:nil];
    NSMutableArray *preload;
    NSMutableArray *modules;
    
    _jsonConfigure = [NSMutableDictionary dictionaryWithDictionary:fileJSON];
    _appEntryFile = [_jsonConfigure objectForKey:@"main"];
    
    if (_appEntryFile == nil) {
        _appEntryFile = [_enginePath stringByAppendingString:@"app/index"];
    }
    
    _entryFile = [_jsonConfigure objectForKey:@"engineEntry"];
    
    if (_entryFile == nil) {
        _entryFile = @"index";
    }
    
    preload = [[NSMutableArray alloc] initWithArray:[_jsonConfigure objectForKey:@"preload"]];
    modules = [[NSMutableArray alloc] init];
    
    for ( int i = 0; i < [preload count] ; i++ ) {
        NSMutableDictionary *fileObject = [NSMutableDictionary dictionaryWithDictionary:[preload objectAtIndex:i]];
        NSString *filePath = [_scriptFilePath stringByAppendingString:[fileObject objectForKey:@"file"]];
        [fileObject setObject:filePath forKey:@"file"];
        [modules addObject:fileObject];
    }
    
    _modules = modules;
    _version = [_jsonConfigure objectForKey:@"version"];
    _author = [_jsonConfigure objectForKey:@"author"];
    
    
    return self;
}


+ (instancetype)sharedConfigure: (NSString *)filePath pathForScript: (NSString *)scriptPath pathForEngine: (NSString *) enginePath {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        configure = [[AWConfigure alloc] init];
        
        [configure readyForConfigure:filePath
                       pathForScript: scriptPath
                       pathForEngein:enginePath];
        
        
        [configure fileForConfigure];
    });
    
    return configure;
}

@end
