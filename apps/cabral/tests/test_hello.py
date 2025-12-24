"""Hello unit test module."""

from cabral.hello import hello


def test_hello():
    """Test the hello function."""
    assert hello() == "Hello cabral"
