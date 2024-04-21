import time, os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from convert import convert_ppt_to_images

class OnMyWatch:
	watchDirectory = "/Users/milesbloom/Library/Mobile Documents/com~apple~CloudDocs/Continuous/"

	def __init__(self):
		self.observer = Observer()

	def run(self):
		event_handler = Handler()
		self.observer.schedule(event_handler, self.watchDirectory, recursive = True)
		self.observer.start()
		
		try:
			while True:
				time.sleep(5)
		except:
			self.observer.stop()
			print("Observer Stopped")

		self.observer.join()


class Handler(FileSystemEventHandler):

	@staticmethod
	def on_any_event(event):
		if event.is_directory:
			return None

		elif event.event_type == 'created':
			if len(event.src_path.split('.')) == 1:
				return None

			pathList = event.src_path.split('.')

			if pathList[-1] in ['ppt','pptx']:
				os.makedirs("".join(pathList[:-1]))				

if __name__ == '__main__':
	watch = OnMyWatch()
	watch.run()
