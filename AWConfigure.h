//
//  AWConfigure.h
//  aniwei
//
//  Created by weiyanhai on 16/10/5.
//  Copyright © 2016年 wiki.aniwei. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface AWConfigure : NSObject

@property (atomic, strong) NSMutableDictionary *jsonConfigure;

@property (atomic, copy) NSString *entryFile;

@property (atomic, copy) NSString *appEntryFile;

@property (atomic, strong) NSMutableArray *modules;

@property (atomic, copy) NSString *configureFilePath;

@property (atomic, copy) NSString *scriptFilePath;

@property (atomic, copy) NSString *enginePath;

@property (atomic, copy) NSString *version;

@property (atomic, copy) NSString *author;

+ (instancetype)sharedConfigure: (NSString *)filePath pathForScript: (NSString *)scriptPath pathForEngine: (NSString *) enginePath;

@end
