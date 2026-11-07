#include <iostream>
using namespace std;

int main() {
    // De 1997 à 1007, en reculant de 10 : le dernier chiffre reste 7.
    for (int i = 1997; i >= 1007; i -= 10) {
        cout << i << "\n";
    }
    return 0;
}
