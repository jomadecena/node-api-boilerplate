type Level = "fatal" | "critical" | "error" | "warning" | "debug" | "info";

interface EventTag {
	file: string
	function: string
	[key: string]: string
}

export const captureException = (e: any, friendlyMessage?: string) => {
	console.error(friendlyMessage || "", e);
};

export const captureEvent = (
	level: Level = "info",
	message: string,
	tags: EventTag,
) => {
  console.log({
    level,
    tags: tags,
    message
  })
};