//
//  AWContext.h
//  aniwei
//
//  Created by weiyanhai on 16/10/5.
//  Copyright © 2016年 wiki.aniwei. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "AWConfigure.h"

@interface AWContext : NSObject

@property (atomic, strong) NSMutableDictionary *context;

+ (instancetype) sharedContext: (NSString *)pathForEngine configureForEngine: (AWConfigure *)configure;

@end
