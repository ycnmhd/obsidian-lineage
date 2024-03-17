import { __obsidian__ } from '../../getters/obsidian/load-obsidian';
import { delay, MEDIUM } from '../../general/delay';

export const dragAndDropBelow = async (draggedId: string, targetId: string) => {
    const subjectSelector = `#${draggedId} .draggable`;
    const targetSelector = `#${targetId}`;
    await __obsidian__.$eval(subjectSelector, (el) => {
        el.dataset['test'] = 'true';
    });
    await __obsidian__.locator(subjectSelector).hover();
    await __obsidian__.mouse.down();
    await __obsidian__.locator(targetSelector).hover();
    await __obsidian__.mouse.up();
    await delay(MEDIUM);
};

/*
   const view = await getActiveView();
   const subjectElement = await view.$(subjectSelector);
   const targetElement = await view.$(targetSelector);
   invariant(subjectElement);
   invariant(targetElement);
   const subjectElementBound = await subjectElement.boundingBox();
   const targetElementBound = await targetElement.boundingBox();
   invariant(subjectElementBound);
   invariant(targetElementBound);

   let targetX, targetY;

   switch (direction) {
       case 'up':
           targetX = targetElementBound.x + targetElementBound.width / 2;
           targetY = targetElementBound.y;
           break;
       case 'down':
           targetX = targetElementBound.x + targetElementBound.width / 2;
           targetY = targetElementBound.y + targetElementBound.height;
           break;
       case 'right':
           targetX = targetElementBound.x + targetElementBound.width;
           targetY = targetElementBound.y + targetElementBound.height / 2;
           break;
       default:
           throw new Error(
               'Invalid direction parameter. Use "top", "down", or "right".',
           );
   }*/
