//
//  AWEventsProtocol.h
//  aniwei
//
//  Created by weiyanhai on 16/10/5.
//  Copyright © 2016年 wiki.aniwei. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol AWEventsProtocol <NSObject>

@required
- (void) onAppDidFinishLaunching: (NSNotification*)notification;

@required
- (void) onAppWillTerminate: (NSNotification*)notification;

@required
- (void) onAppWillResignActive: (NSNotification*)notification;

@required
- (void) onAppWillEnterForeground: (NSNotification*)notification;

@required
- (void) onAppDidBecomeActive: (NSNotification*)notification;

@required
- (void) onAppDidEnterBackground: (NSNotification*)notification;

@end
