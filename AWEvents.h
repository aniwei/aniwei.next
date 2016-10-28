//
//  AWEvents.h
//  aniwei
//
//  Created by weiyanhai on 16/10/5.
//  Copyright © 2016年 wiki.aniwei. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "AWEventsProtocol.h"

@interface AWEvents : NSObject

@property id <AWEventsProtocol> delegate;

+ (instancetype)shareEvents;

- (instancetype)startApplicationEvents;

@end
