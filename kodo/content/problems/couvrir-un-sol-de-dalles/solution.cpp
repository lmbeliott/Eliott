#include <iostream>
using namespace std;

int main() {
    int l, h, c;
    cin >> l >> h >> c;

    // Division arrondie au-dessus : (X + C - 1) / C.
    int surLongueur = (l + c - 1) / c;
    int surLargeur = (h + c - 1) / c;
    int dalles = surLongueur * surLargeur;

    // Surface de toutes les dalles posées, moins la surface du sol.
    // Elle reste sous 400 millions : elle tient dans un int.
    int jete = dalles * c * c - l * h;

    cout << dalles << "\n";
    cout << jete << "\n";
    return 0;
}
