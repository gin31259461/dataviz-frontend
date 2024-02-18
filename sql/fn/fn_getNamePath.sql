USE [DV]
GO
/****** Object:  UserDefinedFunction [dbo].[fn_getNamePath]    Script Date: 2024/2/18 下午 01:33:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO

--取得NamePath資料
Create OR ALTER function [dbo].[fn_getNamePath](@PCID int, @CName nvarchar(255))
	returns nvarchar(900)
as
begin
	declare @nLevel int = (select nLevel from Class where CID = @PCID)
	declare @NamePath nvarchar(900)
	if (@nLevel is NULL)
		select @NamePath = @CName, @nLevel = 0
	else
		set @NamePath = (select NamePath + '/' + @CName from Class where CID = @PCID)
	return @NamePath
end
