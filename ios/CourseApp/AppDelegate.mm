#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"CourseApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  // [self copySupportFiles];
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)copySupportFiles
{
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,
                                                       NSUserDomainMask, YES);
  if ([paths count] <= 0){
    return;
  }
  NSLog(@"path_doctumnet %@", [paths objectAtIndex:0]);
  NSString *_documentsDir = [paths objectAtIndex:0];
  NSFileManager *fm = [NSFileManager defaultManager];
  NSArray* localDocuments = [fm contentsOfDirectoryAtPath:_documentsDir error:nil];
  NSArray * _demoFiles = [NSArray arrayWithObjects:@"", nil];
  for(NSString *demoFile in _demoFiles){
      NSURL *modelURL = [[NSBundle mainBundle] URLForResource:[demoFile stringByDeletingPathExtension] withExtension:[demoFile pathExtension]];
      NSLog(@"fm %@", modelURL.path);
      if([fm fileExistsAtPath:modelURL.path]){
        NSURL *toURL = [NSURL fileURLWithPath:[_documentsDir stringByAppendingPathComponent:demoFile]];
        [fm copyItemAtURL:modelURL toURL:toURL error:nil];
          
        NSLog(@"copy success: %@ ", demoFile);
      }
      else {
        NSLog(@"copy failed: %@ ", demoFile);
      }
  }
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
