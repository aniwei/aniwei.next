//
//  AWBridge.h
//  aniwei
//
//  Created by weiyanhai on 16/10/5.
//  Copyright © 2016年 wiki.aniwei. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <JavaScriptCore/JavaScriptCore.h>

@protocol AWBridgeExport <JSExport>

- (instancetype)invoke;

@end

@interface AWBridge : NSObject <AWBridgeExport>

@end
