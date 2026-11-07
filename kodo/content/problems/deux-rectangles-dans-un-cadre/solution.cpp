#include <iostream>
using namespace std;

int main() {
    int w, h, a, b, c, d;
    cin >> w >> h >> a >> b >> c >> d;

    // Deux rectangles sont côte à côte, ou l'un au-dessus de l'autre.
    // Chacun peut être tourné : on essaie les 4 combinaisons de sens.
    bool possible = false;

    // Premier rectangle A sur B, second C sur D.
    if (a + c <= w && b <= h && d <= h) possible = true;
    if (b + d <= h && a <= w && c <= w) possible = true;
    // Premier rectangle A sur B, second tourné : D sur C.
    if (a + d <= w && b <= h && c <= h) possible = true;
    if (b + c <= h && a <= w && d <= w) possible = true;
    // Premier rectangle tourné : B sur A, second C sur D.
    if (b + c <= w && a <= h && d <= h) possible = true;
    if (a + d <= h && b <= w && c <= w) possible = true;
    // Les deux tournés : B sur A, et D sur C.
    if (b + d <= w && a <= h && c <= h) possible = true;
    if (a + c <= h && b <= w && d <= w) possible = true;

    if (possible) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}
