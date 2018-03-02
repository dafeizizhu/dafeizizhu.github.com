---
layout: post
title: "从零开始我的iOS开发"
description: ""
category: 
tags: [xcode, ios, objective-c]
---

### 版本

1. mac，macOS High Sierra 10.13.3
2. Xcode，Version 9.2 (9C40b)

### 开始！

**File** -> **New** -> **Project...**:

![新建项目](/images/20180302-001.png)

选择Single View App:

![新建项目](/images/20180302-002.png)

输入Product Name `"Demo"`，选择保存位置创建新的项目：

![新建项目](/images/20180302-003.png)

由于当前版本的Xcode新建的项目都是基于Storyboard的，这里为了折腾，删掉Storyboard及其相关的自动创建的文件：

1. ViewController.h
2. ViewController.m
3. Main.stroyboard
4. LaunchScreen.storyboard

去掉Target设置中的Main Interface的内容：

![删除Main Interface](/images/20180302-004.png)

修改后的文件如下：

![文件列表](/images/20180302-005.png)

选中Demo组，**File** -> **New** -> **File**，选择Cocoa Touch Class：

![新建类](/images/20180302-006.png)

在Class中输入`"MainViewController"`，Subclass of可以根据需求选不同的类，在这次例子中选中`"UITableViewController"`：

![新建类](/images/20180302-007.png)

这个类将作为起始的ViewController进行加载。在AppDelegate.m里面，先引入刚才创建的类的头文件：

    #import "MainViewController.h"

然后为`application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions`添加代码：

    - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
      self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
      self.window.rootViewController = [[UINavigationController alloc] initWithRootViewController:[[MainViewController alloc] init]];
      [self.window makeKeyAndVisible];

      return YES;
    }

**Product** -> **Run**，Xcode会启动模拟器并启动我们的应用：

![启动应用](/images/20180302-008.png)

导航栏上啥都没有？莫慌，在MainViewController.m文件中的`viewDidLoad`方法中添加如下代码：

    - (void)viewDidLoad {
      [super viewDidLoad];

      self.navigationItem.title = @"Demo";
      self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemEdit target:self action:@selector(onEdit:)];
      self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemAdd target:self action:@selector(onAdd:)];
    }

    - (void)onEdit:(id)sender {
    }

    - (void)onAdd:(id)sender {
    }

重新启动应用：

![启动应用](/images/20180302-009.png)

在接入真正数据之前，先来弄点假数据。在MainViewController.m中添加如下代码：

    - (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
      return 20;
    }
    - (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
      static NSString *cellIdentifier = @"cellIdentifier";
      
      UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
      if (nil == cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleSubTitle reuseIdentifier:cellIdentifier];
      }

      cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
      cell.textLabel.text = @"demo";
      cell.detailTextLabel.text = [NSDateFormatter localizedStringFromDate:[NSDate date] dateStyle:NSDateFormatterMediumStyle timeStyle:NSDateFormatterMediumStyle];
      
      return cell;
    }

重新启动应用：

![启动应用](/images/20180302-013.png)

20行假数据出现了。现在添加两个`UIViewController`：

1. `DetailViewController`，继承自`UIViewController`，并勾上Also create XIB file。
1. `AddViewController`，继承自`UIViewController`，并勾上Also create XIB file。

在DetailViewController.xib中添加一个UILabel，内容为`"DetailViewController"`：

![设计视图](/images/20180302-010.png)

在AddViewController.xib中添加一个UILabel，内容为`"AddViewController"`。这样就可以知道导航到哪个UIViewController上了。

在MainViewController.m文件中再添加以下代码：

    #import "DetailViewController.h"

    ...

    - (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
      DetailViewController *detailViewController = [[DetailViewController alloc] init];
      [self.navigationController pushViewController:detailViewController animated:YES];
    }

重新启动应用，选中其中一行，就会导航到DetailViewController：

![导航到DetailViewController](/images/20180302-011.png)

UINavigationController会处理导航的前进后退，以及自动添加左上角的“返回”按钮。单击左上角的按钮就可以回到MainViewController。

继续处理MainViewController和AddViewController之间的导航关系。在MainViewController.m中添加如下代码：

    #import "AddViewController.h"

    ...

    - (void)onAdd:(id)sender {
      AddViewController *addViewController = [[AddViewController alloc] init];
      [self.navigationController presentViewController:[[UINavigationController alloc] initWithRootViewController:addViewController] animated:YES completion:nil];
    }

在AddViewController.m中添加如下代码：

    - (void)viewDidLoad {
      [super viewDidLoad];

      self.navigationItem.title = @"Add";
      self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemCancel target:self action:@selector(onCancel:)];
      self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemSave target:self action:@selector(onSave:)];
    }
    - (void)onCancel:(id)sender {
      [self.navigationController dismissViewControllerAnimated:YES completion:nil];
    }
    - (void)onSave:(id)sender {
    }

重新启动应用，单击右上角的加号按钮，会弹出一个模态的“对话框”：

![导航到AddViewController](/images/20180302-012.png)

单击Cancel就能回到MainViewController。今天就先到这。我们用纯代码的方式完成了应用的基本导航。UI设计、数据持久化下回分解吧！
