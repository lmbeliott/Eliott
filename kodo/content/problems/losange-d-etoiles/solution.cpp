#include <iostream>
using namespace std;

int main() {
    // Moitié haute : 1, 3, 5 étoiles, centrées par des points.
    cout << "...*..." << "\n";
    cout << "..***.." << "\n";
    cout << ".*****." << "\n";
    // Ligne du milieu.
    cout << "*******" << "\n";
    // Moitié basse : le reflet de la moitié haute.
    cout << ".*****." << "\n";
    cout << "..***.." << "\n";
    cout << "...*..." << "\n";
    return 0;
}
