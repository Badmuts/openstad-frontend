function showIdeaArgumentReactions(idea, argumentId) {

	var infoblock = document.querySelector('#info-block')
	infoblock.innerHTML = document.querySelector('#idea-argument-reactions').innerHTML;

	var argument;
	if ( idea && idea.argumentsFor ) { // todo: dit moet gewoon arguments worden zo gauw de API dat aan kan
		idea.argumentsFor.forEach(function (arg) {
			if (arg.id == argumentId) {
				argument = arg;
			}
		});
		if (argument) {
			if (argument.hasUserVoted) infoblock.querySelector('.votes').className += ' hasvoted';
			infoblock.querySelector('.description').innerHTML = argument.description;
			infoblock.querySelector('.username').innerHTML = argument.user.nickName || ( argument.user.firstName || '' ) + ' ' + ( argument.user.lastName || '' );
			infoblock.querySelector('.user-and-date').querySelector('.username').innerHTML = argument.user.nickName || ( argument.user.firstName || '' ) + ' ' + ( argument.user.lastName || '' );
			infoblock.querySelector('.date').innerHTML = argument.createDateHumanized;
			infoblock.querySelector('.no-of-votes').innerHTML = argument.yes || 0;

			var template = infoblock.querySelector('.argument-reaction');
			if (argument.reactions && argument.reactions.length) {
				argument.reactions.forEach(function(argument) {
					var div = template.cloneNode(true);
					div.querySelector('.description').innerHTML = argument.description;
					div.querySelector('.username').innerHTML = argument.user.nickName || ( argument.user.firstName || '' ) + ' ' + ( argument.user.lastName || '' );
					div.querySelector('.date').innerHTML = argument.createDateHumanized;
					document.querySelector('.argument-reactions').appendChild(div);
				});
			}
			document.querySelector('.argument-reactions').removeChild(template);

			infoblock.innerHTML = infoblock.innerHTML.replace(/\[\[ideaId\]\]/g, idea.id)
			infoblock.innerHTML = infoblock.innerHTML.replace(/\[\[argumentId\]\]/g, argument.id)

		}

	}

	if (userJWT) {
		infoblock.querySelector('.argument-reactions-form').style.display = 'block';
		infoblock.querySelector('.not-logged-in').style.display = 'none';
		var textarea  = infoblock.querySelector('textarea[id="description"]');
		var charsLeft = infoblock.querySelector('#charsLeftDescription');
		initCharactersLeft(textarea, charsLeft, config.arguments.descriptionMinLength, config.arguments.descriptionMaxLength);
	} else {
		infoblock.querySelector('.argument-reactions-form').style.display = 'none';
		infoblock.querySelector('.not-logged-in').style.display = 'block';
	}

	openInfoBlock()

}

function validateNewArgumentReactionForm() {

	var isValid = true;

	if (document.querySelector('#description').value.length < config.arguments.descriptionMinLength) {
		document.querySelector('#form-warning-description').style.display = 'block';
		document.querySelector('#form-warning-description').innerHTML = document.querySelector('#form-warning-description').innerHTML.replace('[[langkort]]', 'kort');
		isValid = false;
	} else if (document.querySelector('#description').value.length > config.arguments.descriptionMaxLength) {
		document.querySelector('#form-warning-description').style.display = 'block';
		document.querySelector('#form-warning-description').innerHTML = document.querySelector('#form-warning-description').innerHTML.replace('[[langkort]]', 'lang');
		isValid = false;
	} else {
		document.querySelector('#form-warning-description').style.display = 'none';
	}

	return isValid;

}

function submitNewArgumentReaction(idea, form) {

	if ( !validateNewArgumentForm() ) return;

	if (!userJWT) return showError('Je bent niet ingelogd');

	var url = apiUrl + '/api/site/' + siteId + '/idea/' + idea.id + '/argument';

	var parentId = form.querySelector('#argumentId').value;

	var body = {
		ideaId: idea.id,
		parentId: parentId,
		description: form.querySelector('#description').value,
		sentiment: 'for', // todo: dit zo optioneel moeten zijn
	}

	console.log(body);

	fetch(url, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'X-Authorization': 'Bearer ' + userJWT,
		},
		body: JSON.stringify(body),
	})
		.then(function(response) {
			if (response.ok) {
				return response.json()
			}
			throw response.text();
		})
		.then( function (json) {
			if ( idea && idea.argumentsFor ) { // todo: dit moet gewoon arguments worden zo gauw de API dat aan kan
				var argument;
				idea.argumentsFor.forEach(function(arg) {
					if (arg.id == parentId) {
						argument = arg;
					}
				});
				console.log(argument);
				argument.reactions = argument.reactions || [];
				argument.reactions.unshift(json)
			}

			showIdeaArgumentReactions(idea, parentId)

		})
		.catch(function(error) {
			showError(error);
		});

}