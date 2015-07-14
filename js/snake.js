$(document).ready(function(){

	//delete Tap Delay
	FastClick.attach(document.body);

	//initialization canvas
	var canvas = $("#canvas")[0];
	var game = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	//localstorage max length
	if(localStorage.getItem('max_length_snake') == undefined)
	{
		localStorage.setItem('max_length_snake', 5);
	}

	//localstorage length
	if(localStorage.getItem('length_snake') == undefined)
	{
		localStorage.setItem('length_snake', 5);
	}

	//initialization variables
	var cell_size = 10;
	var direction; 
	var food;
	var columns;
	var speed;
	var snake; 
	var status = 0;
	var cell_x;
	var cell_y;
	var check_columns;
	var snake_length;
	var max_lenght = localStorage.getItem('max_length_snake') || 5;





	//check length snake, max = 45
	function check_length_snake()
	{
		if(localStorage.getItem('length_snake') > 40)
		{
			snake_length = 35;
			localStorage.setItem('length_snake', 35);
		}
		else
		{
			snake_length = localStorage.getItem('length_snake') || 5;
		}
	}
		check_length_snake();
	//print statistics
	$(".status").html("<p>Длина змейки: "+snake_length+"</p><p>Максимальная длина: "+max_lenght+"</p>");
	




	//speed detection	
	function button_check() 
	{
		var speed_radio = document.getElementsByName("speed");
    	for (var i = 0; i < speed_radio.length; i++) 
    	{
        	if (speed_radio[i].type == "radio" && speed_radio[i].checked) 
        	{
            	speed = speed_radio[i].value;
        	}
    	}
	}





	//start game
	var botton = document.getElementById("start_buttton"); 
	$("#start_buttton").click(function()
	{
		if(status==0)
		{
			button_check();
			init_game();
			botton.setAttribute("value", "Пауза");
			status = 1;
		}
		else if(status==1)
		{
			clearInterval(game_loop);
			botton.setAttribute("value", "Продолжить");
			status = 2;
		}
		else
		{
			button_check();
			game_loop = setInterval(main, speed);
			botton.setAttribute("value", "Пауза");
			status = 1;
		}
		
	});





	//restart game
	$("#restart_buttton").click(function()
	{		
		localStorage.setItem('length_snake', 5);
		button_check();
		init_game();
		botton.setAttribute("value", "Пауза");
		status = 1;
	});





	//clear status button
	$(".clear_status_buttton").click(function()
	{		
		localStorage.setItem('length_snake', 5);
		localStorage.setItem('max_length_snake', 5);
		snake_length = 5;
		max_lenght = 5
		botton.setAttribute("value", "Старт");
		status = 0;
		$(".status").html("<p>Длина змейки: 5</p><p>Максимальная длина: 5</p>");
	});





	//initialization game
	function init_game()
	{
		check_length_snake();

		create_snake();
		checkbox_columns();
		if (check_columns == 1)
		{
			create_columns(snake_length, snake_length*cell_size, 0);
		}
		
		create_food(); 

		direction = "right";

		if(typeof game_loop != "undefined")
		{
			clearInterval(game_loop);
		} 
		game_loop = setInterval(main, speed);
	}
	




	//create snake
	function create_snake()
	{
		snake = [];
		for(var i = snake_length-1; i>=0; i--)
		{
			snake.push({x: i, y:0});
		}
	}
	




	//create food
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cell_size)/cell_size), 
			y: Math.round(Math.random()*(h-cell_size)/cell_size), 
		};
	}





	//check checkbox columns
	function checkbox_columns()
	{
		if(document.getElementById("columns").checked)
		{
			check_columns = 1;
		}
	}
	

	


	//create columns
	function create_columns(length, x, y)
	{
		columns = [];
		columns[0] = parseInt(length/10, 10);
		for(var i=1; i<=2*columns[0]; i++)
		{
			columns[i] = Math.round(Math.random()*(w-cell_size)/cell_size);
			columns[i] = (columns[i] == x || columns[i] == (x - cell_size) || columns[i] == (x + cell_size)) ? columns[i]+1 : columns[i];

			columns[i+1] = Math.round(Math.random()*(h-cell_size)/cell_size);
			columns[i+1] = (columns[i+1] == y || columns[i+1] == (y - cell_size) || columns[i+1] == (y + cell_size)) ? columns[i+1]+1 : columns[i+1];
			i++;
		}
	}





	// main function
	function main()
	{
		game.fillStyle = "white";
		game.fillRect(0, 0, w, h);

		cell_x = snake[0].x;
		cell_y = snake[0].y;

		//direction of motion
		if(direction == "up") cell_y--;
		else if(direction == "left") cell_x--;
		else if(direction == "down") cell_y++;
		else if(direction == "right") cell_x++;

		//check colomns
		if(check_columns == 1) 
		{
			for(var i=1; i<=2*columns[0]; i++)
			{
				if(cell_x == columns[i] &&  cell_y == columns[i+1])
				{
					localStorage.setItem('length_snake', 5);
					init_game();				
					return;
				}
				i++;
			}
		}

		//check loop and border
		if(document.getElementById("field").checked) 
	    {
			if(check_loop(cell_x, cell_y, snake))
			{
				localStorage.setItem('length_snake', 5);
				init_game();				
				return;
			}

			if(cell_x == -1)
			{
				cell_x = w/cell_size;
			}
			else if(cell_x == w/cell_size)
			{
				cell_x = 0;
			}

			if(cell_y == -1)
			{
				cell_y = h/cell_size;
			}
			else if(cell_y == h/cell_size)
			{
				cell_y = 0;
			}
		}
		else
		{
			if(check_loop(cell_x, cell_y, snake) || cell_x == -1 || cell_x == w/cell_size || cell_y == -1 || cell_y == h/cell_size) 
			{ 
				localStorage.setItem('length_snake', 5);
				init_game(); 
				return; 
			}
		}

		//check eat
		if(cell_x == food.x && cell_y == food.y)
		{
			var tail_snake = {x: cell_x, y: cell_y};

			snake_length++;
			localStorage.setItem('length_snake', snake_length);

			if(max_lenght<snake_length)
			{
				max_lenght = snake_length;
				localStorage.setItem('max_length_snake', max_lenght);
			}
			create_columns(snake_length, food.x, food.y);
			create_food();
		}
		else
		{
			var tail_snake = snake.pop(); 
			tail_snake.x = cell_x; tail_snake.y = cell_y;
		}
		
		snake.unshift(tail_snake);
		
		
		//paint columns
		if(check_columns == 1) 
		{
			for(var i=1; i<=2*columns[0]; i++)
			{	
				paint(columns[i], columns[i+1], "#ddd");
				i++;
			}
		}

		//paint snake
		for(var i = 0; i < snake.length; i++)
		{
			var c = snake[i];
			paint(c.x, c.y, "#17B4ED");
		}

		//paint food
		paint(food.x, food.y, "#17B4ED");

		//print statistics
		$(".status").html("<p>Длина змейки: "+snake_length+"</p><p>Максимальная длина: "+max_lenght+"</p>");


	}
	




	//function paint all cell (snake and food)
	function paint(x, y, color)
	{
		game.fillStyle = color;
		game.fillRect(x*cell_size, y*cell_size, cell_size, cell_size);
		game.strokeStyle = "white";
		game.strokeRect(x*cell_size, y*cell_size, cell_size, cell_size);
	}
	




	//function check loop (clash)
	function check_loop(x, y, array)
	{
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			{
				return true;
			}
		}
		return false;
	}





	//events keyboard
	$(document).keydown(function(e){
		var key = e.which;
		if(key == "38" && direction != "down" && status==1) direction = "up";
		else if(key == "37" && direction != "right" && status==1) direction = "left";
		else if(key == "40" && direction != "up" && status==1) direction = "down";
		else if(key == "39" && direction != "left" && status==1) direction = "right";
	})
	




	//events mouse
	$("#up").click(function()
	{
		if (direction != "down" && status==1)
			direction = "up";
	});

	$("#left").click(function()
	{
		if(direction != "right" && status==1)
			direction = "left";
	});

	$("#right").click(function()
	{
		if(direction != "left" && status==1)
			direction = "right";
	});

	$("#down").click(function()
	{
		if(direction != "up" && status==1)
			direction = "down";
	});

	//display settings on mobile
	$("#settings_buttton").click(function()
	{
		$(".settings").toggle("slow");
	});

});